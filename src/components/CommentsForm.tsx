import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button } from '@material-ui/core';

// pin id übergeben
const CommentForm = (id: number) => {
  const [comment, setComment] = useState('');

  const handleChange = (event: any) => {
    setComment(event.target.value);
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    try {
      // Step 3: Make an API call to post the comment
      const response = await axios.post('/api/comments', { comment, id });
      console.log(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        value={comment}
        fullWidth
        label="Leave a comment"
        id="fullWidth"
        placeholder="Leave a comment"
        onChange={handleChange}
        variant="outlined"
        InputProps={{
          style: {
            color: 'white',
          },
        }}
      />
      {/* https://mui.com/material-ui/react-text-field/#customization */}
      <p>&nbsp;</p>
      <input
        type="submit"
        value="Post comment"
        id="signup-btn-submit"
        className="flex-auto w-full max-w-xs h-full p-2 mb-4 text-white bg-bright-seaweed border-solid border rounded-md transition-colors cursor-pointer"
      />
    </form>
  );
};

export default CommentForm;
