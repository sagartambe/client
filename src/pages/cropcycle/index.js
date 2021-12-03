import useSWR from 'swr';
import { Label, Table, Pagination, Button, Confirm } from 'semantic-ui-react';
import { Link, useHistory, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { fetcher, poster } from '../../utils/api';

const CropCycle = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [deleteCropCycle, setDeleteCropCycle] = useState(0);
  const { data, error } = useSWR(`cropcycle?limit=${limit}&page=${page}`, fetcher);
  const [successMessage, setSuccess] = useState("");
  const [errorMessage, setError] = useState("");
  const [openConfirmation, setOpenConfirmation] = useState(false);

  const deleteCropCycleConfirm = () => {
    poster(`cropcycle/delete`, {id: deleteCropCycle})
      .then((data) => {
        setOpenConfirmation(false);
        setDeleteCropCycle(0);
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
  const processDeleteCropCycle = (id) => {
    setOpenConfirmation(true);
    setDeleteCropCycle(id);
  }
  const closeOpenConfirmation = () => {
    setOpenConfirmation(false);
    setDeleteCropCycle(0);
  }
  return (
    <div>
      <Confirm
        open={openConfirmation}
        onCancel={closeOpenConfirmation}
        onConfirm={deleteCropCycleConfirm}
      />
      <Button className="floatRight" as={Link} to="/app/cropcycle/add">Add Crop Cycle</Button>
      <h1>Crop Cycle</h1>
      <div className="clear"></div>
      <div>{successMessage}</div>
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Crop Name</Table.HeaderCell>
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
              <Table.Cell className="width40">{record.Crop.name}</Table.Cell>
              <Table.Cell>
                <Button as={Link} to={`/app/cropcycle/edit/${record.id}`}>Edit</Button>
                <Button onClick={() => processDeleteCropCycle(record.id)}>Delete</Button>
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

const CropCycleAdd = () => {
  const { data } = useSWR(`crop`, fetcher);
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState("");
  const history = useHistory();

  const onSubmit = (data) => {
    poster(`cropcycle/create`, data)
      .then((data) => {
        if (data.error_message) {
          setError(data.error_message);
        }
        else {
          history.push('/app/cropcycle');
        }
      });
  };

  return (
    <div>
      <Button className="floatRight" as={Link} to="/app/cropcycle">Back</Button>
      <h1>Add Crop Cycle</h1>
      <form className="formStyle" onSubmit={handleSubmit(onSubmit)}>
        <div className="error">{error}</div>
        <input className="input" {...register("name", {required: true})} placeholder="Crop Cycle Name" />
        <select className="input" {...register("crop_id", {required: true})}>
        <option value="">Select Crop</option>
        {data && data.rows.map((record, i) => (
          <option key={i} value={record.id}>{record.name}</option>
        ))}
      </select>
        <input className="button" type="submit" />
      </form>
    </div>
  );
}

const CropCycleEdit = () => {
  const { data } = useSWR(`crop`, fetcher);
  const { register, handleSubmit, setValue } = useForm();
  const [name, setName] = useState("");
  const [crop, setCrop] = useState("");
  const [error, setError] = useState("");
  const { id } = useParams();
  const history = useHistory();

  const onSubmit = (data) => {
    data.id = id;
    setName(data.name);
    setCrop(data.crop_id);
    poster(`cropcycle/update`, data)
      .then((data) => {
        if (data.error_message) {
          setError(data.error_message);
        }
        else {
          history.push('/app/cropcycle');
        }
      });
  };

  useEffect(() => {
    fetcher(`cropcycle?id=${id}`)
    .then((data) => {
      setName(data.rows[0].name);
      setCrop(data.rows[0].Crop.id);
    })
    .catch((error) => {
      console.log(error);
    });
  }, []);

  return (
    <div>
      <Button className="floatRight" as={Link} to="/app/cropcycle">Back</Button>
      <h1>Edit Crop Cycle</h1>
      <form className="formStyle" onSubmit={handleSubmit(onSubmit)}>
        <div className="error">{error}</div>
        <input className="input" {...register("name", {required: true})} {...setValue('name', name)} placeholder="Crop Cycle Name" />
        <select className="input" {...register("crop_id", {required: true})} {...setValue('crop_id', crop)}>
        <option value="">Select Crop</option>
        {data && data.rows.map((record, i) => (
          <option key={i} value={record.id}>{record.name}</option>
        ))}
      </select>
        <input className="button" type="submit" />
      </form>
    </div>
  );
}

export { CropCycle, CropCycleAdd, CropCycleEdit }
