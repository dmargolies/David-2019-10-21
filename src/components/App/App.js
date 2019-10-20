import React, { useState, useEffect } from 'react';
import './App.css';

import Documents from 'components/Documents';
import FileInput from 'components/FileInput';

import { deleteFile, fetchFiles, postFile, searchFiles } from 'services/files';
import formatSize, { ONE_MEGABYTE } from 'utils/formatSize';
import generateUploadError from 'utils/generateUploadError';

const TEN_MEGABYTES = ONE_MEGABYTE * 10;

const getErrorMessage = ({ msg, statusText }) => msg || statusText;

function App() {
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFiles()
      .then(({ files, error }) => {
        setDocuments(files);
      })
      .catch(err => setError(getErrorMessage(err)));
  }, []);

  useEffect(() => {
    if (error) {
      window.alert(error);
      setError(null);
    }
  }, [error]);

  function handleUpload({ error, file }) {
    if (error) {
      return setError(generateUploadError(error, file));
    }

    postFile(file)
      .then(newDocument => setDocuments([...documents, newDocument]))
      .catch(err => setError(getErrorMessage(err)));
  }

  function handleDelete(filekey) {
    deleteFile(filekey)
      .then(() => setDocuments(documents.filter(file => file.filekey !== filekey)))
      .catch(err => setError(getErrorMessage(err)));
  }

  function handleSearch({ target: { value: searchTerm }}) {
    // TODO debounce this
    searchFiles(searchTerm)
      .then(({ files }) => setDocuments(files))
      .catch(err => setError(getErrorMessage(err)));
  }

  const totalSize = documents.reduce((acc, { size }) => acc + size, 0);

  return (
    <div className="App">
      <header className="header">
        <input
          className="search"
          type="text"
          placeholder="Search documents..."
          onChange={handleSearch}/>
        <FileInput
          accept="image/jpeg, image/png"
          maxSize={TEN_MEGABYTES}
          onUpload={handleUpload} />
      </header>

      <header className="header">
        <h1>{documents.length} documents</h1>
        <span>Total size: {formatSize(totalSize)}</span>
      </header>

      <Documents documents={documents} onDelete={handleDelete}/>
    </div>
  );
}

export default App;
