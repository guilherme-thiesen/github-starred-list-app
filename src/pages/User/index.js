import React, { Component } from 'react';
import { ActivityIndicator, Text } from 'react-native';
import PropTypes from 'prop-types';
import api from '../../services/api';

import {
  Container,
  Header,
  Name,
  Avatar,
  Bio,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
} from './styles';

export default class User extends Component {
  state = {
    stars: [],
    loading: true,
    page: 1,
    loadingMore: false,
  };

  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('user').name,
  });

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
      navigate: PropTypes.func,
    }).isRequired,
  };

  async componentDidMount() {
    this.setState({ loading: true });
    await this.load();
    this.setState({ loading: false });
  }

  async load(page = 1) {
    const { navigation } = this.props;
    const user = navigation.getParam('user');
    const { stars } = this.state;

    if (page > 1) {
      this.setState({ loadingMore: true });
    }

    const response = await api.get(`users/${user.login}/starred`, {
      params: { page },
    });

    this.setState({
      loadingMore: false,
      page,
      stars: page >= 2 ? [...stars, ...response.data] : response.data,
    });

    return response;
  }

  handleNavigate = repository => {
    const { navigation } = this.props;

    navigation.navigate('Repository', { repository });
  };

  render() {
    const { navigation } = this.props;
    const { stars, loading, page, loadingMore } = this.state;
    const user = navigation.getParam('user');

    return (
      <Container>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>
        {loading ? (
          <ActivityIndicator size={30} />
        ) : (
          <Stars
            onRefresh={() => {
              this.load(1);
            }}
            refreshing={loading}
            onEndReachedThreshold={0.2} // Carrega mais itens quando chegar em 20% do fim
            onEndReached={() => {
              this.load(page + 1);
            }} // Função que carrega mais itenss
            data={stars}
            keyExtractor={star => String(star.id)}
            renderItem={({ item }) => (
              <Starred onPress={() => this.handleNavigate(item)}>
                <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
                <Info>
                  <Title>{item.name}</Title>
                  <Author>{item.owner.login}</Author>
                </Info>
              </Starred>
            )}
          />
        )}
        {loadingMore ? <ActivityIndicator size={30} /> : <Text />}
      </Container>
    );
  }
}
