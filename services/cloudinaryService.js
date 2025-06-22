export const uploadImagemParaCloudinary = async (imagemUri) => {
  const data = new FormData();

  data.append('file', {
    uri: imagemUri,
    type: 'image/jpeg',
    name: 'upload.jpg',
  });
  
  data.append('upload_preset', 'appfitness');
  data.append('cloud_name', 'duzlk5puc');

  const res = await fetch('https://api.cloudinary.com/v1_1/duzlk5puc/image/upload', {
    method: 'POST',
    body: data,
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error('Erro no upload da imagem');
  }

  return json.secure_url;
};
