import React, { useState } from 'react';

function FileInput() {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
    }
  };

  return (
    <div>
      <input
        type="file"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        id="file-upload"
      />
      <label htmlFor="file-upload">
        {file ? file.name : 'No file chosen'}
      </label>
      <button onClick={() => document.getElementById('file-upload').click()}>
        Choose File
      </button>
    </div>
  );
}

export default FileInput;
