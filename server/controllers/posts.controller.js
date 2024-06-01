import { ApiResponse } from "../helpers/apiResponse.js";
import { ApiError } from "../helpers/errorHandler.js";
import { postsCollection } from "../utils/mongoConnect.js";

export const getPosts = async (req, res) => {
  try {
    const posts = await postsCollection.find().toArray();
    console.log(posts);
    res.json(new ApiResponse(200, posts));
  } catch (error) {
    res.json(new ApiError(500, null, error.message));
  }
};
