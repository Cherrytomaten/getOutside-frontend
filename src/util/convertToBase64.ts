type Base64ConverterResult = string | ArrayBuffer | null;

function convertBase64(file: File): Promise<Base64ConverterResult> {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = () => {
      resolve(fileReader.result);
    };

    fileReader.onerror = (error) => {
      reject(error);
    };
  });
}

export { convertBase64 };
