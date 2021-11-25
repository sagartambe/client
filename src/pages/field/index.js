import useSWR from 'swr';
import { Label, Table, Pagination, Button, Form } from 'semantic-ui-react';
import { Link } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { API, fetcher, poster } from '../../constants';

const Field = () => {
  const { data, error } = useSWR(`${API}/field`, fetcher);
  return (
    <div>
      <Button className="floatRight" as={Link} to="/app/field/add">Add Field</Button>
      <div className="clear"></div>
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Specification</Table.HeaderCell>
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
              <Table.Cell className="width30">{record.name}</Table.Cell>
              <Table.Cell className="width40">{record.specification}</Table.Cell>
              <Table.Cell>
                <Button as={Link} to={`/app/field/edit/${record.id}`}>Edit</Button> <Button>Delete</Button>
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
                totalPages={(data.count > 10) ? Math.ceil(data.count % 10) : 1}
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
  const { data, error } = useSWR(`${API}/region`, fetcher);
  const { register, handleSubmit } = useForm();
  const [result, setResult] = useState("");
  const onSubmit = (data) => {
    setResult(JSON.stringify(data));
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    };
    poster(`${API}/field/create`, requestOptions);
  };

  return (
    <div>
      <Button className="floatRight" as={Link} to="/app/field">Back</Button>
      <h1>Add Field</h1>
      <form className="formStyle" onSubmit={handleSubmit(onSubmit)}>
        <input className="input" {...register("name")} placeholder="Field Name" />
        <input className="input" {...register("specification")} placeholder="Field Specification" />
        <select className="input" {...register("region_id")}>
        <option value="">Select Region</option>
        {data && data.rows.map((record, i) => (
          <option key={i} value={record.id}>{record.name}</option>
        ))}
      </select>
        <p>{result}</p>
        <input className="button" type="submit" />
      </form>
    </div>
  );
}

const FieldEdit = () => {
  const { data, error } = useSWR(`${API}/organization`, fetcher);
  const { register, handleSubmit } = useForm();
  const [result, setResult] = useState("");
  const onSubmit = (data) => {
    setResult(JSON.stringify(data));
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    };
    poster(`${API}/field/update`, requestOptions);
  };

  return (
    <div>
      <Button className="floatRight" as={Link} to="/app/field">Back</Button>
      <h1>Edit Field</h1>
      <form className="formStyle" onSubmit={handleSubmit(onSubmit)}>
        <input className="input" {...register("name")} placeholder="Field Name" />
        <select className="input" {...register("property_id")}>
        <option value="">Select Organization</option>
        {data && data.rows.map((record, i) => (
          <option key={i} value={record.id}>{record.name}</option>
        ))}
      </select>
        <p>{result}</p>
        <input className="button" type="submit" />
      </form>
    </div>
  );
}

export { Field, FieldAdd, FieldEdit }
