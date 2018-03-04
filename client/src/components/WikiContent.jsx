import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class WikiContent extends Component {
  static propTypes = {
    ep: PropTypes.string.isRequired,
    page: PropTypes.string.isRequired,
  }
  state = {
    content: null,
  };

  componentWillMount() {
    const { ep, page } = this.props;
    this.fetchPage(ep, page);
  }

  componentWillReceiveProps(newProps) {
    const { ep } = this.props;
    const { page } = newProps;
    this.fetchPage(ep, page);
  }

  fetchPage(ep, page) {
    fetch(`/wiki/${ep}/${page}`)
      .then(resp => resp.json())
      .then(({ content }) => this.setState({ content }));
  }

  render() {
    return <div dangerouslySetInnerHTML={{ __html: this.state.content }} />;
  }
}
