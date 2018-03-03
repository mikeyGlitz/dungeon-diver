import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class WikiContent extends Component {
  static propTypes = {
    page: PropTypes.string.isRequired,
  }
  state = {
    content: null,
  };

  componentWillMount() {
    const { page } = this.props;
    fetch(`/wiki/places/${page}`)
      .then(resp => resp.json())
      .then(({ content }) => this.setState({ content }));
  }

  render() {
    return <div dangerouslySetInnerHTML={{ __html: this.state.content }} />;
  }
}
