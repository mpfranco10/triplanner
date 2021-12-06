import React from 'react';
import Editable from 'react-text-content-editable'

export default class Nota extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.noteId,
      title: this.props.title,
      text: this.props.text,
    };
    this.contentEditable = React.createRef();
  }

  componentDidMount() {
  }

  handleNoteEdit = (value) => {
    this.setState({ title: value });
    this.props.handleChange(this.state.id, value, this.state.text);
  }

  handleNoteEditText = (value) => {
    this.setState({ text: value });
    this.props.handleChange(this.state.id, this.state.title, value);
  }

  handleDelete = () => {
    this.props.deleteNote(this.state.id);
  }

  render() {
    return (
      <a>
         <span id='close' onClick={this.handleDelete} >x</span>
        <Editable
          tag='h2'
          type='text'
          maxLength='20'
          onChange={this.handleNoteEdit}
          value={this.state.title}
        />
        <Editable
          tag='p'
          type='text'
          maxLength='60'
          onChange={this.handleNoteEditText}
          value={this.state.text}
        />
      </a>

    );
  }
}