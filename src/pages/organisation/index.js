import useSWR from 'swr';
import { Label, Table, Pagination, Button, Confirm } from 'semantic-ui-react';
import { Link, useHistory, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { fetcher, poster } from '../../utils/api';

const Organisation = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [errorMessage, setError] = useState("");
  const [successMessage, setSuccess] = useState("");
  const [deleteOrg, setDeleteOrg] = useState(0);
  const [openConfirmation, setOpenConfirmation] = useState(false);

  const { data, error } = useSWR(`organization?limit=${limit}&page=${page}`, fetcher);
  const deleteOrganization = () => {
    poster(`organization/delete`, {id: deleteOrg})
      .then((data) => {
        setOpenConfirmation(false);
        setDeleteOrg(0);
        if (data.error_message) {
          setError(data.error_message);
        }
        else {
          setSuccess(data.message);
          setPage(2);
          setPage(1);
        }
      });
  }
  const processDeleteOrganization = (id) => {
    setOpenConfirmation(true);
    setDeleteOrg(id);
  }
  const closeOpenConfirmation = () => {
    setOpenConfirmation(false);
    setDeleteOrg(0);
  }

  return (
    <div>
      <Confirm
        open={openConfirmation}
        onCancel={closeOpenConfirmation}
        onConfirm={deleteOrganization}
      />
      <Button className="floatRight" as={Link} to="/app/organizations/add">Add Organization</Button>
      <h1>Organizations</h1>
      <div className="clear"></div>
      <div>{successMessage}</div>
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
          <OrganizationList data={data} error={error} processDeleteOrganization={processDeleteOrganization}  />
        <Table.Footer>
          <Table.Row textAlign="right">
            <Table.HeaderCell colSpan='2'>
            {data && (
              <Pagination
                defaultActivePage={page}
                firstItem={null}
                lastItem={null}
                pointing
                totalPages={(data.count > limit) ? Math.ceil(data.count / limit) : 1}
                onPageChange={(event, data) => setPage(data.activePage) }
              />
            )}
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table>
    </div>
  );
};

const OrganizationList = ({ data, error, processDeleteOrganization }) => {
  return (
    <Table.Body>
      {error && (
        <Table.Row>
          <Table.Cell colSpan={2}>
            <Label>Error loading data...</Label>
          </Table.Cell>
        </Table.Row>
      )}
      {!data && !error && (
        <Table.Row>
          <Table.Cell colSpan={2}>
            <Label>Loading...</Label>
          </Table.Cell>
        </Table.Row>
      )}
      {data && data.rows.map((record, i) => (
        <Table.Row key={i}>
          <Table.Cell className="width60">{record.name}</Table.Cell>
          <Table.Cell>
            <Button as={Link} to={`/app/organizations/edit/${record.id}`}>Edit</Button>
            <Button onClick={() => processDeleteOrganization(record.id)}>Delete</Button>
          </Table.Cell>
        </Table.Row>
      ))}
    </Table.Body>
  );
};

const OrganisationAdd = () => {
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState("");
  const history = useHistory();

  const onSubmit = (data) => {
    poster(`organization/create`, data)
      .then((data) => {
        if (data.error_message) {
          setError(data.error_message);
        }
        else {
          history.push('/app/organizations');
        }
      });
  };

  return (
    <div>
      <Button className="floatRight" as={Link} to="/app/organizations">Back</Button>
      <h1>Add Organization</h1>
      <form className="formStyle" onSubmit={handleSubmit(onSubmit)}>
        <div className="error">{error}</div>
        <input className="input" {...register("name", {required: true})} placeholder="Organization Name" />
        <input className="button" type="submit" />
      </form>
    </div>
  );
}

const OrganisationEdit = () => {
  const { register, handleSubmit, setValue } = useForm();
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const history = useHistory();
  const { id } = useParams();

  useEffect(() => {
    fetcher(`organization?id=${id}`)
    .then((data) => {
      setName(data.rows[0].name);
    })
    .catch((error) => {
      console.log(error);
    });
  }, []);

  const onSubmit = (data) => {
    data.id = id;
    setName(data.name);
    poster(`organization/update`, data)
      .then((data) => {
        if (data.error_message) {
          setError(data.error_message);
        }
        else {
          history.push('/app/organizations');
        }
      });
  };

  return (
    <div>
      <Button className="floatRight" as={Link} to="/app/organizations">Back</Button>
      <h1>Edit Organization</h1>
      <form className="formStyle" onSubmit={handleSubmit(onSubmit)}>
        <div className="error">{error}</div>
        <input className="input" {...register("name", {required: true})} {...setValue('name', name)} placeholder="Organization Name" />
        <input className="button" type="submit" />
      </form>
    </div>
  );
}

export { Organisation, OrganisationAdd, OrganisationEdit, OrganizationList }
