import useSWR from 'swr';
import { Label, Table, Pagination, Button, Confirm } from 'semantic-ui-react';
import { Link, useHistory, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { API, fetcher, poster } from '../../constants';

const CropCycleField = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [deleteCropCycleField, setDeleteCropCycleField] = useState(0);
  const { data, error } = useSWR(`${API}/cropcyclefield?limit=${limit}&page=${page}`, fetcher);
  const [successMessage, setSuccess] = useState("");
  const [errorMessage, setError] = useState("");
  const [openConfirmation, setOpenConfirmation] = useState(false);

  const deleteCropCycleFieldConfirm = () => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({id: deleteCropCycleField})
    };
    poster(`${API}/cropcyclefield/delete`, requestOptions)
      .then((data) => {
        setOpenConfirmation(false);
        setDeleteCropCycleField(0);
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
  const processDeleteCropCycleField = (id) => {
    setOpenConfirmation(true);
    setDeleteCropCycleField(id);
  }
  const closeOpenConfirmation = () => {
    setOpenConfirmation(false);
    setDeleteCropCycleField(0);
  }
  return (
    <div>
      <Confirm
        open={openConfirmation}
        onCancel={closeOpenConfirmation}
        onConfirm={deleteCropCycleFieldConfirm}
      />
      <Button className="floatRight" as={Link} to="/app/cropcyclefield/add">Add Crop Cycle Field</Button>
      <h1>Crop Cycle Fields</h1>
      <div className="clear"></div>
      <div>{successMessage}</div>
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Crop Cycle Name</Table.HeaderCell>
            <Table.HeaderCell>Field Name</Table.HeaderCell>
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
              <Table.Cell>{record.CropCycle.name}</Table.Cell>
              <Table.Cell>{record.Field.name}</Table.Cell>
              <Table.Cell className="width20">
                <Button as={Link} to={`/app/cropcyclefield/edit/${record.id}`}>Edit</Button>
                <Button onClick={() => processDeleteCropCycleField(record.id)}>Delete</Button>
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

const CropCycleFieldAdd = () => {
  const { data: cropCycleData, error: cropCycleError } = useSWR(`${API}/cropcycle`, fetcher);
  const { data: fieldData, error: fieldError } = useSWR(`${API}/field`, fetcher);
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState("");
  const history = useHistory();

  const onSubmit = (data) => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    };
    poster(`${API}/cropcyclefield/create`, requestOptions)
      .then((data) => {
        if (data.error_message) {
          setError(data.error_message);
        }
        else {
          history.push('/app/cropcyclefield');
        }
      });
  };

  return (
    <div>
      <Button className="floatRight" as={Link} to="/app/cropcyclefield">Back</Button>
      <h1>Add Crop Cycle Field</h1>
      <form className="formStyle" onSubmit={handleSubmit(onSubmit)}>
        <div className="error">{error}</div>
        <input className="input" {...register("name", {required: true})} placeholder="Crop Cycle Field Name" />
        <select className="input" {...register("cropcycle_id", {required: true})}>
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
        <input className="button" type="submit" />
      </form>
    </div>
  );
}

const CropCycleFieldEdit = () => {
  const { data: cropCycleData, error: cropCycleError } = useSWR(`${API}/cropcycle`, fetcher);
  const { data: fieldData, error: fieldError } = useSWR(`${API}/field`, fetcher);
  const { register, handleSubmit, setValue } = useForm();
  const [name, setName] = useState("");
  const [cropcycle, setCropCycle] = useState("");
  const [field, setField] = useState("");
  const [error, setError] = useState("");
  const { id } = useParams();
  const history = useHistory();

  const onSubmit = (data) => {
    data.id = id;
    setName(data.name);
    setCropCycle(data.cropcycle_id);
    setField(data.field_id);
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    };
    poster(`${API}/cropcyclefield/update`, requestOptions)
      .then((data) => {
        if (data.error_message) {
          setError(data.error_message);
        }
        else {
          history.push('/app/cropcyclefield');
        }
      });
  };

  useEffect(() => {
    fetcher(`${API}/cropcyclefield?id=${id}`)
    .then((data) => {
      setName(data.rows[0].name);
      setCropCycle(data.rows[0].cropCycleId);
      setField(data.rows[0].fieldId);
    })
    .catch((error) => {
      console.log(error);
    });
  }, []);

  return (
    <div>
      <Button className="floatRight" as={Link} to="/app/cropcyclefield">Back</Button>
      <h1>Edit Crop Cycle Field</h1>
      <form className="formStyle" onSubmit={handleSubmit(onSubmit)}>
        <div className="error">{error}</div>
        <input className="input" {...register("name", {required: true})} {...setValue('name', name)} placeholder="Crop Cycle Field Name" />
        <select className="input" {...register("cropcycle_id", {required: true})} {...setValue('cropcycle_id', cropcycle)}>
          <option value="">Select Crop Cycle</option>
          {cropCycleData && cropCycleData.rows.map((record, i) => (
            <option key={i} value={record.id}>{record.name}</option>
          ))}
        </select>
        <select className="input" {...register("field_id")} {...setValue('field_id', field)}>
          <option value="">Select Field</option>
          {fieldData && fieldData.rows.map((record, i) => (
            <option key={i} value={record.id}>{record.name}</option>
          ))}
        </select>
        <input className="button" type="submit" />
      </form>
    </div>
  );
}

export { CropCycleField, CropCycleFieldAdd, CropCycleFieldEdit }
