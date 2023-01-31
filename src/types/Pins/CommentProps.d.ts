type CommentProps = {
  author: {
    username: string;
    profile_picture: string | null;
    uuid: string;
  };
  text: string;
  uuid: string;
};
