import useSWR from 'swr';
import { Label, Table, Pagination, Button, Confirm } from 'semantic-ui-react';
import { Link, useHistory, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { fetcher, poster } from '../../utils/api';

const Property = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [deleteProp, setDeleteProperty] = useState(0);
  const { data, error } = useSWR(`property?limit=${limit}&page=${page}`, fetcher);
  const [successMessage, setSuccess] = useState("");
  const [errorMessage, setError] = useState("");
  const [openConfirmation, setOpenConfirmation] = useState(false);

  const deleteProperty = () => {
    poster(`property/delete`, {id: deleteProp})
      .then((data) => {
        setOpenConfirmation(false);
        setDeleteProperty(0);
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
  const processDeleteProperty = (id) => {
    setOpenConfirmation(true);
    setDeleteProperty(id);
  }
  const closeOpenConfirmation = () => {
    setOpenConfirmation(false);
    setDeleteProperty(0);
  }
  return (
    <div>
      <Confirm
        open={openConfirmation}
        onCancel={closeOpenConfirmation}
        onConfirm={deleteProperty}
      />
      <Button className="floatRight" as={Link} to="/app/property/add">Add Property</Button>
      <h1>Properties</h1>
      <div className="clear"></div>
      <div>{successMessage}</div>
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Organization Name</Table.HeaderCell>
            <Table.HeaderCell>Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {error && (
            <Table.Row>
              <Table.Cell colSpan={3}>
                <Label>Error loading data...</Label>
              </Table.Cell>
            </Table.Row>
          )}
          {!data && !error && (
            <Table.Row>
              <Table.Cell colSpan={3}>
                <Label>Loading...</Label>
              </Table.Cell>
            </Table.Row>
          )}
          {data && data.rows.map((record, i) => (
            <Table.Row key={i}>
              <Table.Cell className="width40">{record.name}</Table.Cell>
              <Table.Cell className="width40">{record.Organization.name}</Table.Cell>
              <Table.Cell>
                <Button as={Link} to={`/app/property/edit/${record.id}`}>Edit</Button>
                <Button onClick={() => processDeleteProperty(record.id)}>Delete</Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
        <Table.Footer>
          <Table.Row textAlign="right">
            <Table.HeaderCell colSpan='3'>
            {data && (
              <Pagination
                defaultActivePage={1}
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

const PropertyAdd = () => {

  const { data } = useSWR(`organization`, fetcher);
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState("");
  const history = useHistory();

  const onSubmit = (data) => {
    poster(`property/create`, data)
      .then((data) => {
        if (data.error_message) {
          setError(data.error_message);
        }
        else {
          history.push('/app/property');
        }
      });
  };

  return (
    <div>
      <Button className="floatRight" as={Link} to="/app/property">Back</Button>
      <h1>Add Property</h1>
      <form className="formStyle" onSubmit={handleSubmit(onSubmit)}>
        <div className="error">{error}</div>
        <input className="input" {...register("name", {required: true})} placeholder="Property Name" />
        <select className="input" {...register("organization_id", {required: true})}>
        <option value="">Select Organization</option>
        {data && data.rows.map((record, i) => (
          <option key={i} value={record.id}>{record.name}</option>
        ))}
      </select>
        <input className="button" type="submit" />
      </form>
    </div>
  );
}

const PropertyEdit = () => {
  const { data } = useSWR(`organization`, fetcher);
  const { register, handleSubmit, setValue } = useForm();
  const [name, setName] = useState("");
  const [organizationId, setOrganizationId] = useState("");
  const [error, setError] = useState("");
  const { id } = useParams();
  const history = useHistory();

  const onSubmit = (data) => {
    data.id = id;
    setName(data.name);
    poster(`property/update`, data)
      .then((data) => {
        if (data.error_message) {
          setError(data.error_message);
        }
        else {
          history.push('/app/property');
        }
      });
  };

  useEffect(() => {
    fetcher(`property?id=${id}`)
    .then((data) => {
      setName(data.rows[0].name);
      setOrganizationId(data.rows[0].Organization.id)
    })
    .catch((error) => {
      console.log(error);
    });
  }, []);

  return (
    <div>
      <Button className="floatRight" as={Link} to="/app/property">Back</Button>
      <h1>Edit Property</h1>
      <form className="formStyle" onSubmit={handleSubmit(onSubmit)}>
        <div className="error">{error}</div>
        <input className="input" {...register("name", {required: true})} {...setValue('name', name)} placeholder="Property Name" />
        <select className="input" {...register("organization_id", {required: true})} {...setValue('organization_id', organizationId)}>
          <option value="">Select Organization</option>
          {data && data.rows.map(record => (
            <option value={record.id}>{record.name}</option>
          ))}
      </select>
        <input className="button" type="submit" />
      </form>
    </div>
  );
}

export { Property, PropertyAdd, PropertyEdit }
