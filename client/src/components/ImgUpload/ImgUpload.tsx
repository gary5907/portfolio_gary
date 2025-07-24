import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

import "./ImgUpload.css";

const maxLength = 255;

type ImgUploadProps = {
  onFilesChange: (files: File[]) => void;
};

export default function ImgUpload({ onFilesChange }: ImgUploadProps) {
  const [files, setFiles] = useState<(File & { preview: string })[]>([]);

  const imageValidator = (files: File) => {
    if (files.name.length > maxLength) {
      return {
        code: "name-too-large",
        message: `Le nom de l'image ne doit pas dépasser ${maxLength} caractères`,
      };
    }
    return null;
  };

  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    validator: imageValidator,
    accept: {
      "image/*": [],
    },
    onDrop: (acceptedFiles) => {
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        }),
      );
      setFiles(newFiles);
      onFilesChange(acceptedFiles);
    },
  });

  const thumbs = files.map((file) => (
    <div className="thumb" key={file.name}>
      <div className="thumbInner">
        <img
          className="img"
          src={file.preview}
          onLoad={() => {
            URL.revokeObjectURL(file.preview);
          }}
          alt="thumb pic"
        />
      </div>
    </div>
  ));

  useEffect(() => {
    return () => {
      for (const file of files) {
        URL.revokeObjectURL(file.preview);
      }
    };
  }, [files]);

  return (
    <section className="container">
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        {files.length > 0 ? (
          thumbs
        ) : (
          <p>Cliquez pour ajouter, ou déposez une image ici</p>
        )}
      </div>
    </section>
  );
}
