import useSWR from 'swr';
import { Label, Table, Pagination, Button, Confirm } from 'semantic-ui-react';
import { Link, useHistory, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { fetcher, poster } from '../../utils/api';

const Field = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [deleteField, setDeleteField] = useState(0);
  const { data, error } = useSWR(`field?limit=${limit}&page=${page}`, fetcher);
  const [successMessage, setSuccess] = useState("");
  const [errorMessage, setError] = useState("");
  const [openConfirmation, setOpenConfirmation] = useState(false);

  const deleteFieldConfirm = () => {
    poster(`field/delete`, {id: deleteField})
      .then((data) => {
        setOpenConfirmation(false);
        setDeleteField(0);
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
  const processDeleteField = (id) => {
    setOpenConfirmation(true);
    setDeleteField(id);
  }
  const closeOpenConfirmation = () => {
    setOpenConfirmation(false);
    setDeleteField(0);
  }
  return (
    <div>
      <Confirm
        open={openConfirmation}
        onCancel={closeOpenConfirmation}
        onConfirm={deleteFieldConfirm}
      />
      <Button className="floatRight" as={Link} to="/app/field/add">Add Field</Button>
      <h1>Fields</h1>
      <div className="clear"></div>
      <div>{successMessage}</div>
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Specification</Table.HeaderCell>
            <Table.HeaderCell>Region</Table.HeaderCell>
            <Table.HeaderCell>Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {error && (
            <Table.Row>
              <Table.Cell colSpan={4}>
                <Label>Error loading data...</Label>
              </Table.Cell>
            </Table.Row>
          )}
          {!data && !error && (
            <Table.Row>
              <Table.Cell colSpan={4}>
                <Label>Loading...</Label>
              </Table.Cell>
            </Table.Row>
          )}
          {data && data.rows.map((record, i) => (
            <Table.Row key={i}>
              <Table.Cell>{record.name}</Table.Cell>
              <Table.Cell>{record.specification}</Table.Cell>
              <Table.Cell>{record.Region.name}</Table.Cell>
              <Table.Cell className="width20">
                <Button as={Link} to={`/app/field/edit/${record.id}`}>Edit</Button>
                <Button onClick={() => processDeleteField(record.id)}>Delete</Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
        <Table.Footer>
          <Table.Row textAlign="right">
            <Table.HeaderCell colSpan='4'>
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

const FieldAdd = () => {
  const { data } = useSWR(`region`, fetcher);
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState("");
  const history = useHistory();

  const onSubmit = (data) => {
    poster(`field/create`, data)
      .then((data) => {
        if (data.error_message) {
          setError(data.error_message);
        }
        else {
          history.push('/app/field');
        }
      });
  };

  return (
    <div>
      <Button className="floatRight" as={Link} to="/app/field">Back</Button>
      <h1>Add Field</h1>
      <form className="formStyle" onSubmit={handleSubmit(onSubmit)}>
        <div className="error">{error}</div>
        <input className="input" {...register("name", {required: true})} placeholder="Field Name" />
        <input className="input" {...register("specification", {required: true})} placeholder="Field Specification" />
        <select className="input" {...register("region_id", {required: true})}>
        <option value="">Select Region</option>
        {data && data.rows.map((record, i) => (
          <option key={i} value={record.id}>{record.name}</option>
        ))}
      </select>
        <input className="button" type="submit" />
      </form>
    </div>
  );
}

const FieldEdit = () => {
  const { data } = useSWR(`region`, fetcher);
  const { register, handleSubmit, setValue } = useForm();
  const [name, setName] = useState("");
  const [specification, setSpecification] = useState("");
  const [regionId, setRegionId] = useState("");
  const [error, setError] = useState("");
  const { id } = useParams();
  const history = useHistory();

  const onSubmit = (data) => {
    data.id = id;
    setName(data.name);
    setSpecification(data.specification);
    setRegionId(data.region_id);
    poster(`field/update`, data)
      .then((data) => {
        if (data.error_message) {
          setError(data.error_message);
        }
        else {
          history.push('/app/field');
        }
      });
  };

  useEffect(() => {
    fetcher(`field?id=${id}`)
    .then((data) => {
      setName(data.rows[0].name);
      setSpecification(data.rows[0].specification);
      setRegionId(data.rows[0].Region.id)
    })
    .catch((error) => {
      console.log(error);
    });
  }, []);

  return (
    <div>
      <Button className="floatRight" as={Link} to="/app/field">Back</Button>
      <h1>Edit Field</h1>
      <form className="formStyle" onSubmit={handleSubmit(onSubmit)}>
        <div className="error">{error}</div>
        <input className="input" {...register("name", {required: true})} {...setValue('name', name)} placeholder="Field Name" />
        <input className="input" {...register("specification", {required: true})} {...setValue('specification', specification)} placeholder="Field Specification" />
        <select className="input" {...register("region_id", {required: true})} {...setValue('region_id', regionId)}>
        <option value="">Select Region</option>
        {data && data.rows.map((record, i) => (
          <option key={i} value={record.id}>{record.name}</option>
        ))}
      </select>
        <input className="button" type="submit" />
      </form>
    </div>
  );
}

export { Field, FieldAdd, FieldEdit }
