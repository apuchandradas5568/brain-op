import { ApiResponse } from "../helpers/apiResponse.js";
import { ApiError } from "../helpers/errorHandler.js";
import { usersCollection } from "../utils/mongoConnect.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signUp = async (req, res) => {
  try {
    const { username, email, password, name, profilePicture } = req.body;

    if (!username || !email || !password) {
      return res.json(new ApiError(400, null, "Please fill all fields"));
    }

    const existingUserByEmail = await usersCollection.findOne({ email });

    const existingUserByUsername = await usersCollection.findOne({ username });

    if (existingUserByEmail) {
      return res.json(
        new ApiError(400, null, "User with this email already exists")
      );
    }

    if (existingUserByUsername) {
      return res.json(
        new ApiError(400, null, "User with this username already exists")
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
      username,
      email,
      password: hashedPassword,
      name,
      profilePicture,
    };

    const createdUser = await usersCollection.insertOne(user);

    const { password: userPassword, ...gettingUser } =
      await usersCollection.findOne({
        _id: createdUser.insertedId,
      });


    res
      .json(new ApiResponse(200, gettingUser));
  } catch (error) {
    res.json(new ApiError(500, null, error.message));
  }
};

export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json(new ApiError(400, null, "Please fill all fields"));
    }

    const user = await usersCollection.findOne({ email });

    if (!user) {
      return res.json(new ApiError(400, null, "Invalid credentials"));
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.json(new ApiError(400, null, "Invalid credentials"));
    }

    const { password: userPassword, ...gettingUser } = user;

    const token = jwt.sign({ data: gettingUser }, process.env.TOKEN_SECRET, {
      expiresIn: "30d",
    });

    res
    .setHeader("Access-Control-Allow-Credentials", true)
    .cookie("userData", token, {
      httpOnly: true,
      secure: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    })
    .json(new ApiResponse(200, gettingUser));
  } catch (error) {
    res.json(new ApiError(500, null, error.message));
  }
};

export const signOut = async (req, res) => {
  res
    .clearCookie("userdata")
    .json(new ApiResponse(200, null, "User signed out"));
};
