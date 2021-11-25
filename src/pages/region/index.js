import useSWR from 'swr';
import { Label, Table, Pagination, Button, Form } from 'semantic-ui-react';
import { Link } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { API, fetcher, poster } from '../../constants';

const Region = () => {
  const { data, error } = useSWR(`${API}/region`, fetcher);
  return (
    <div>
      <Button className="floatRight" as={Link} to="/app/region/add">Add Region</Button>
      <div className="clear"></div>
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
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
                <Button as={Link} to={`/app/region/edit/${record.id}`}>Edit</Button> <Button>Delete</Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
        <Table.Footer>
          <Table.Row textAlign="right">
            <Table.HeaderCell colSpan='2'>
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

const RegionAdd = () => {
  const { data, error } = useSWR(`${API}/property`, fetcher);
  const { register, handleSubmit } = useForm();
  const [result, setResult] = useState("");
  const onSubmit = (data) => {
    setResult(JSON.stringify(data));
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    };
    poster(`${API}/region/create`, requestOptions);
  };

  return (
    <div>
      <Button className="floatRight" as={Link} to="/app/region">Back</Button>
      <h1>Add Region</h1>
      <form className="formStyle" onSubmit={handleSubmit(onSubmit)}>
        <input className="input" {...register("name")} placeholder="Region Name" />
        <select className="input" {...register("property_id")}>
        <option value="">Select Property</option>
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

const RegionEdit = () => {
  const { data, error } = useSWR(`${API}/property`, fetcher);
  const { register, handleSubmit } = useForm();
  const [result, setResult] = useState("");
  const onSubmit = (data) => {
    setResult(JSON.stringify(data));
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    };
    poster(`${API}/region/update`, requestOptions);
  };

  return (
    <div>
      <Button className="floatRight" as={Link} to="/app/region">Back</Button>
      <h1>Edit Region</h1>
      <form className="formStyle" onSubmit={handleSubmit(onSubmit)}>
        <input className="input" {...register("name")} placeholder="Region Name" />
        <select className="input" {...register("property_id")}>
        <option value="">Select Property</option>
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

export { Region, RegionAdd, RegionEdit }
