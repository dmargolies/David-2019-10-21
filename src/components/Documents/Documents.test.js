import React from 'react';
import { create } from 'react-test-renderer';

import Documents from './Documents';

const MOCK_FILENAME_1 = 'mockFilename1';
const MOCK_FILENAME_2 = 'mockFilename2';

let mockDocs= null;
beforeEach(() => {
  mockDocs = [{ filename: MOCK_FILENAME_1 }, { filename: MOCK_FILENAME_2 }];
});

it('should render without crashing', () => {
  create(<Documents />);
});

it('should render correctly', () => {
  const tree = create(<Documents documents={mockDocs} />).toJSON();

  expect(tree).toMatchSnapshot();
});

it('should render an element for each item in the documents prop', () => {
  const testInstance = create(<Documents documents={mockDocs} />).root;

  expect(testInstance.children[0].children.length).toEqual(mockDocs.length);
});

it('should call the onDelete prop with the specified filename', () => {
  const mockOnDelete = jest.fn();

  const testInstance = create(<Documents documents={mockDocs} onDelete={mockOnDelete}/>).root;

  const firstDoc = testInstance.findByProps({ name: MOCK_FILENAME_1 });
  const secondDoc = testInstance.findByProps({ name: MOCK_FILENAME_2 });

  firstDoc.props.onDelete();
  secondDoc.props.onDelete();

  expect(mockOnDelete.mock.calls).toEqual([[MOCK_FILENAME_1], [MOCK_FILENAME_2]]);
});

it('should not crash if the onDelete prop is not specified', () => {
  const testInstance = create(<Documents documents={mockDocs} />).root;

  const firstDoc = testInstance.findByProps({ name: MOCK_FILENAME_1 });

  firstDoc.props.onDelete();
});
