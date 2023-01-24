import React, { useState } from 'react';
import axios from 'axios';

// pin id übergeben
const CommentForm = (uuid: String) => {
  const [comment, setComment] = useState('');

  const handleChange = (event: any) => {
    setComment(event.target.value);
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    try {
      const response = await axios.post('/api/comments', { comment, uuid });
      console.log(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        id="comment"
        className="w-full p-1 mt-1 text-white bg-transparent border rounded-md"
        onChange={handleChange}
        placeholder="Leave a comment"
        rows="1"
      ></textarea>
      <input
        type="submit"
        value="Post comment"
        id="signup-btn-submit"
        className="flex-auto w-full p-1 mt-1 mb-5 text-white bg-bright-seaweed border-solid border rounded-md transition-colors cursor-pointer"
      />
    </form>
  );
};

export default CommentForm;
