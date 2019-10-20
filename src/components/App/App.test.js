import React from 'react';
import { create, act } from 'react-test-renderer';
import { render, unmountComponentAtNode } from 'react-dom';
import { act as domAct, Simulate } from 'react-dom/test-utils';

import App from './App';
import Documents from 'components/Documents';
import { deleteFile, fetchFiles, searchFiles } from 'services/files';

jest.mock('services/files');

beforeEach(() => {
  fetchFiles.mockResolvedValue({
    files: [{ filename: 'f1', size: 300432 }, { filename: 'f2', size: 300212 }]
  });

  searchFiles.mockResolvedValue({
    files: [{ filename: 'f1', size: 300432 }]
  });

  deleteFile.mockResolvedValue();
});

describe('DOM-less tests ', () => {
  let testRenderer;
  beforeEach( async () => {
    await act(async () => {
      testRenderer = create(<App />);
    });
  });

  it('should render correctly', async () => {
    expect(testRenderer.toJSON()).toMatchSnapshot();
    expect(fetchFiles).toHaveBeenCalled();
  });

  it('should render correctly when there are no documents', async () => {
    fetchFiles.mockResolvedValue({ files: [] });

    expect(testRenderer.toJSON()).toMatchSnapshot();
    expect(fetchFiles).toHaveBeenCalled();
  });

  it('should remove a file once deleted', async () => {
    const testInstance = testRenderer.root;
    const firstDoc = testInstance.findByProps({ name: 'f1' });

    await act(async () => {
      firstDoc.props.onDelete();
    });

    expect(testInstance.findByType(Documents).props.documents)
      .toEqual([{ filename: 'f2', size: 300212 }]);
  });
});

describe('DOM tests', () => {
  let container;
  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    unmountComponentAtNode(container);
    container.remove();
    container = null;
  });

  it('should search for documents when the search input updates', async () => {
    await domAct(async () => {
      render(<App />, container);
    });

    const input = container.querySelector('input[type="text"]');

    await domAct(async () => {
      Simulate.change(input, {target: { value: 'abc' }});
    });

    expect(searchFiles.mock.calls[0][0]).toBe('abc');
  });
});
