import useSWR from 'swr';
import { Label, Table, Pagination, Button, Form } from 'semantic-ui-react';
import { Link } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { API, fetcher, poster } from '../../constants';

const CropCycleField = () => {
  const { data, error } = useSWR(`${API}/cropcyclefield`, fetcher);
  return (
    <div>
      <Button className="floatRight" as={Link} to="/app/cropcyclefield/add">Add Crop Cycle Field</Button>
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
                <Button as={Link} to={`/app/cropcyclefield/edit/${record.id}`}>Edit</Button> <Button>Delete</Button>
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

const CropCycleFieldAdd = () => {
  const { data: cropCycleData, error: cropCycleError } = useSWR(`${API}/cropcycle`, fetcher);
  const { data: fieldData, error: fieldError } = useSWR(`${API}/field`, fetcher);
  const { register, handleSubmit } = useForm();
  const [result, setResult] = useState("");
  const onSubmit = (data) => {
    setResult(JSON.stringify(data));
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    };
    const response = poster(`${API}/cropcyclefield/create`, requestOptions);
    response
      .then((res) => {
        console.log('res', res);
      })
      .catch((err) => {
        console.log('err', err);
      });
  };

  return (
    <div>
      <Button className="floatRight" as={Link} to="/app/cropcyclefield">Back</Button>
      <h1>Add Crop Cycle Field</h1>
      <form className="formStyle" onSubmit={handleSubmit(onSubmit)}>
        <input className="input" {...register("name")} placeholder="Crop Cycle Field Name" />
        <select className="input" {...register("cropcycle_id")}>
          <option value="">Select Crop Cycle</option>
          {cropCycleData && cropCycleData.rows.map((record, i) => (
            <option key={i} value={record.id}>{record.name}</option>
          ))}
        </select>
        <select className="input" {...register("field_id")}>
          <option value="">Select Field</option>
          {fieldData && fieldData.rows.map((record, i) => (
            <option key={i} value={record.id}>{record.name}</option>
          ))}
        </select>
        <p>{result}</p>
        <input className="button" type="submit" />
      </form>
    </div>
  );
}

const CropCycleFieldEdit = () => {
  const { data: cropCycleData, error: cropCycleError } = useSWR(`${API}/cropcycle`, fetcher);
  const { data: fieldData, error: fieldError } = useSWR(`${API}/field`, fetcher);
  const { register, handleSubmit } = useForm();
  const [result, setResult] = useState("");
  const onSubmit = (data) => {
    setResult(JSON.stringify(data));
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    };
    poster(`${API}/cropcyclefield/update`, requestOptions);
  };

  return (
    <div>
      <Button className="floatRight" as={Link} to="/app/cropcyclefield">Back</Button>
      <h1>Edit Crop Cycle Field</h1>
      <form className="formStyle" onSubmit={handleSubmit(onSubmit)}>
        <input className="input" {...register("name")} placeholder="Crop Cycle Field Name" />
        <select className="input" {...register("cropcycle_id")}>
          <option value="">Select Crop Cycle</option>
          {cropCycleData && cropCycleData.rows.map((record, i) => (
            <option key={i} value={record.id}>{record.name}</option>
          ))}
        </select>
        <select className="input" {...register("field_id")}>
          <option value="">Select Field</option>
          {fieldData && fieldData.rows.map((record, i) => (
            <option key={i} value={record.id}>{record.name}</option>
          ))}
        </select>
        <p>{result}</p>
        <input className="button" type="submit" />
      </form>
    </div>
  );
}

export { CropCycleField, CropCycleFieldAdd, CropCycleFieldEdit }
