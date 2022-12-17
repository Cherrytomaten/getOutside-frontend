type ReturnToken = {
  token: string;
  userId: string;
  expirationDate: number;
};

function tokenDecompiler(tokenData: string): ReturnToken {
  console.log('TokenData: ', tokenData);
  let token: string = '';
  let userId: string = '';
  let expirationDate: number = 0;

  if (tokenData === undefined) {
    return { token, userId, expirationDate };
  }

  const tokenDataWithoutBearer = tokenData.split(' ')[1];
  const tokenDataSplit: Array<string> = tokenDataWithoutBearer.split('.');
  token = tokenDataSplit[0];
  userId = tokenDataSplit[1];
  expirationDate = parseInt(tokenDataSplit[2]);

  return { token, userId, expirationDate };
}

export { tokenDecompiler };
