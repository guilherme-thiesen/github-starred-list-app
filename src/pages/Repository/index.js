import React, { Component } from 'react';
import { ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';

import PropTypes from 'prop-types';

import { Container } from './styles';

export default class Repository extends Component {
  state = {
    loading: true,
  };

  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('repository').name,
  });

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
    }).isRequired,
  };

  componentDidMount() {
    this.setState({ loading: false });
  }

  render() {
    const { navigation } = this.props;
    const repository = navigation.getParam('repository');
    const { loading } = this.state;

    return (
      <Container>
        {loading ? (
          <ActivityIndicator size={30} />
        ) : (
          <WebView source={{ uri: repository.html_url }} style={{ flex: 1 }} />
        )}
      </Container>
    );
  }
}
