import useSWR from 'swr';
import { Label, Table, Pagination, Button, Confirm } from 'semantic-ui-react';
import { Link, useHistory, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { API, fetcher, poster } from '../../constants';

const Crop = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [deleteCrop, setDeleteCrop] = useState(0);
  const { data, error } = useSWR(`${API}/crop?limit=${limit}&page=${page}`, fetcher);
  const [successMessage, setSuccess] = useState("");
  const [errorMessage, setError] = useState("");
  const [openConfirmation, setOpenConfirmation] = useState(false);

  const deleteCropConfirm = () => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({id: deleteCrop})
    };
    poster(`${API}/crop/delete`, requestOptions)
      .then((data) => {
        setOpenConfirmation(false);
        setDeleteCrop(0);
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
  const processDeleteCrop = (id) => {
    setOpenConfirmation(true);
    setDeleteCrop(id);
  }
  const closeOpenConfirmation = () => {
    setOpenConfirmation(false);
    setDeleteCrop(0);
  }

  return (
    <div>
      <Confirm
        open={openConfirmation}
        onCancel={closeOpenConfirmation}
        onConfirm={deleteCropConfirm}
      />
      <Button className="floatRight" as={Link} to="/app/crop/add">Add Crop</Button>
      <h1>Crops</h1>
      <div className="clear"></div>
      <div>{successMessage}</div>
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
                <Button as={Link} to={`/app/crop/edit/${record.id}`}>Edit</Button>
                <Button onClick={() => processDeleteCrop(record.id)}>Delete</Button>
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

const CropAdd = () => {
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState("");
  const history = useHistory();

  const onSubmit = (data) => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    };
    poster(`${API}/crop/create`, requestOptions)
      .then((data) => {
        if (data.error_message) {
          setError(data.error_message);
        }
        else {
          history.push('/app/crop');
        }
      });
  };

  return (
    <div>
      <Button className="floatRight" as={Link} to="/app/crop">Back</Button>
      <h1>Add Crop</h1>
      <form className="formStyle" onSubmit={handleSubmit(onSubmit)}>
        <div className="error">{error}</div>
        <input className="input" {...register("name", {required: true})} placeholder="Crop Name" />
        <input className="button" type="submit" />
      </form>
    </div>
  );
}

const CropEdit = () => {
  const { register, handleSubmit, setValue } = useForm();
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const { id } = useParams();
  const history = useHistory();

  const onSubmit = (data) => {
    data.id = id;
    setName(data.name);
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    };
    poster(`${API}/crop/update`, requestOptions)
      .then((data) => {
        if (data.error_message) {
          setError(data.error_message);
        }
        else {
          history.push('/app/crop');
        }
      });
  };

  useEffect(() => {
    fetcher(`${API}/crop?id=${id}`)
    .then((data) => {
      setName(data.rows[0].name);
    })
    .catch((error) => {
      console.log(error);
    });
  }, []);

  return (
    <div>
      <Button className="floatRight" as={Link} to="/app/crop">Back</Button>
      <h1>Edit Crop</h1>
      <form className="formStyle" onSubmit={handleSubmit(onSubmit)}>
        <div className="error">{error}</div>
        <input className="input" {...register("name", {required: true})} {...setValue('name', name)} placeholder="Crop Name" />
        <input className="button" type="submit" />
      </form>
    </div>
  );
}

export { Crop, CropAdd, CropEdit }
