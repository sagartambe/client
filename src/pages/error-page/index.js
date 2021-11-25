import { Header, Icon, Container } from 'semantic-ui-react';

function ErrorPage() {
  return (
    <Container text>
      <Header as='h2' icon textAlign='center'>
        <Icon name='warning sign' size="huge" circular />
        <Header.Content>404 Not found</Header.Content>
        The page you are trying to access doesn't exist.
      </Header>
    </Container>
  );
};

export default ErrorPage;
