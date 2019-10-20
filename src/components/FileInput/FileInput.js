import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import * as Errors from 'constants/Errors';

class FileInput extends Component {
  constructor(props) {
    super(props);

    this.input = React.createRef();
  }

  static propTypes = {
    accept: PropTypes.string,
    maxSize: PropTypes.number,
    onUpload: PropTypes.func
  };

  handleClick = () => {
    this.input.current.click();
  }

  handleChange = ({ target: { files }}) => {
    const { accept, maxSize, onUpload } = this.props;
    const [file] = files;

    if (!file) {
      return;
    }

    const{ size, type } = file;
    let error;

    if (size > maxSize) {
      error = Errors.MAX_SIZE_EXCEEDED;
    }
    else if (accept && !accept.includes(type)) {
      error = Errors.INVALID_FILETYPE
    }

    onUpload && onUpload({ file, error });

    this.input.current.value = '';
  }

  render() {
    const { accept } = this.props;

    return (
      <Fragment>
        <input
          accept={accept}
          hidden
          ref={this.input}
          type="file"
          onChange={this.handleChange} />
          <button onClick={this.handleClick}>UPLOAD</button>
        </Fragment>
    );
  }
}

export default FileInput;
