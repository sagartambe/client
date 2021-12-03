import { BrowserRouter as Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { Table } from 'semantic-ui-react';
import { render, screen } from '@testing-library/react';
import { Organisation, OrganizationList } from './pages/organisation';
import Private from "./pages/private";
import renderWithRouter from './setupTests'


describe("Private", () => {
  it("should redirect to authentication page", () => {
    const { history } = renderWithRouter(<Private />);
    expect(history.location.pathname).toEqual('/auth')
  });
});
describe("Organizations", () => {
  it("should render Organizations component and find page title", () => {
    render(<Router><Organisation /></Router>);
    expect(screen.getByText(/Organizations/i)).toBeInTheDocument();
  });
  it("should render Organizations component and find add organization button", () => {
    render(<Router><Organisation /></Router>);
    expect(screen.getByRole('button')).not.toBeDisabled();
  });
  it("should render Organizations component and show organization list", () => {
    const response = {
      "count":3,
      "rows":[
        {
          "id":1,
          "name":"org 1"
        },
        {
          "id":2,
          "name":"org 2"
        },
        {
          "id":3,
          "name":"org 3"
        },
      ]}
    const processDeleteOrganization = (id) => {
    }
    render(<Router>
      <Table celled>
        <OrganizationList data={response} error={false} processDeleteOrganization={processDeleteOrganization} />
      </Table>
      </Router>);
    expect(screen.getByText(/org 1/i)).toBeInTheDocument();
  });
  it("should render Organizations component and show loading message", () => {
    const processDeleteOrganization = (id) => {
    }
    render(<Router>
      <Table celled>
        <OrganizationList data={false} error={false} processDeleteOrganization={processDeleteOrganization} />
      </Table>
      </Router>);
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });
  it("should render Organizations component and show error message", () => {
    const processDeleteOrganization = (id) => {
    }
    render(<Router>
      <Table celled>
        <OrganizationList data={false} error={true} processDeleteOrganization={processDeleteOrganization} />
      </Table>
      </Router>);
    expect(screen.getByText(/Error loading data.../i)).toBeInTheDocument();
  });
});
