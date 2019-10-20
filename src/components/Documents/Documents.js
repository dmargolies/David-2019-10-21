import React from 'react';
import PropTypes from 'prop-types';
import './Documents.css';

import formatSize from 'utils/formatSize';

function Documents({ documents, onDelete }) {
  return (
    <section className="documents">
      {documents.map(({ filekey, filename, size }) => (
        <Document key={filekey} name={filename} size={size} onDelete={() => onDelete(filekey)} />
      ))}
    </section>
  );
};

Documents.propTypes = {
  documents: PropTypes.arrayOf(PropTypes.shape({
    filekey: PropTypes.string,
    filename: PropTypes.string,
    size: PropTypes.number
  })),
  onDelete: PropTypes.func
};

Documents.defaultProps = {
  documents: [],
  onDelete: () => {}
};

// TODO if we put any links, we need to sanitize, or they could make the filename "javascript: alert('abc')"
function Document({ name, size, onDelete }) {
  return (
    <div className="document">
      <h3 className="name">{name}</h3>
      <section className="info">
        <span>{formatSize(size)}</span>
        <button onClick={onDelete}>delete</button>
      </section>
    </div>
  );
}

export default Documents;
