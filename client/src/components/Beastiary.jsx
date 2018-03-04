import React, { Component } from 'react';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import WikiContent from './WikiContent';

export default class Beastiary extends Component {
  state = {
    loading: false,
    selected: null,
    options: [],
  };

  render() {
    return (
      <div style={{ paddingTop: '3px' }} >
        <span>
          <AsyncTypeahead
            ref={(typeahead) => {
              this.typeahead = typeahead;
            }}
            isLoading={this.state.loading}
            options={this.state.options}
            onSearch={
              (query) => {
                this.setState({ loading: true });
                fetch(`/wiki/monsters/searchsuggestions?search=${query}`)
                .then(res => res.json())
                .then(results => this.setState({
                  loading: false,
                  options: results,
                }));
              }
            }
            onChange={([selected]) => {
              this.setState({ selected });
            }}
            onFocus={() => {
              this.typeahead.getInstance().clear();
            }}
            placeholder="Monster Name"
          />
        </span>
        {this.state.selected && <WikiContent ep="monsters" page={this.state.selected} />}
      </div>
    );
  }
}
