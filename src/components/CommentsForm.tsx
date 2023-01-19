import React, { useState } from 'react';

const CommentForm = () => {
  const [comment, setComment] = useState('');

  const handleChange = (event: any) => {
    setComment(event.target.value);
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    try {
      // Step 3: Make an API call to post the comment
      const response = await fetch('/api/comments', {
        method: 'POST',
        body: JSON.stringify({ comment }),
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      console.log(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={comment}
        onChange={handleChange}
        placeholder="Leave a comment"
      />
      <button type="submit">Post Comment</button>
    </form>
  );
};

export default CommentForm;
