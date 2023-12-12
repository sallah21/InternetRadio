import React, { useState } from "react";

const Image = () => {
  const [image, setImage] = useState();

  useEffect(() => {
    fetch("http://localhost:3000/image")
      .then((response) => response.blob())
      .then((blob) => setImage(blob));
  }, []);

  if (!image) {
    return <div>Loading...</div>;
  }

  return (
    <img src={URL.createObjectURL(image)} alt="Image" />
  );
};

export default Image;
