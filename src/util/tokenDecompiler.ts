type ReturnToken = {
  token: string;
  userId: string;
  expirationDate: number;
};

function tokenDecompiler(tokenData: string): ReturnToken {
  const tokenDataWithoutBearer = tokenData.split(' ')[1];
  const tokenDataSplit: Array<string> = tokenDataWithoutBearer.split('.');
  const token = tokenDataSplit[0];
  const userId = tokenDataSplit[1];
  const expirationDate = parseInt(tokenDataSplit[2]);

  return { token, userId, expirationDate };
}

export { tokenDecompiler };
