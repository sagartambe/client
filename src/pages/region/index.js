import useSWR from 'swr';
import { Label, Table, Pagination, Button, Confirm } from 'semantic-ui-react';
import { Link, useHistory, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { fetcher, poster } from '../../utils/api';

const Region = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [deleteReg, setDeleteRegion] = useState(0);
  const { data, error } = useSWR(`region?limit=${limit}&page=${page}`, fetcher);
  const [successMessage, setSuccess] = useState("");
  const [errorMessage, setError] = useState("");
  const [openConfirmation, setOpenConfirmation] = useState(false);

  const deleteRegion = () => {
    poster(`region/delete`, {id: deleteReg})
      .then((data) => {
        setOpenConfirmation(false);
        setDeleteRegion(0);
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
  const processDeleteRegion = (id) => {
    setOpenConfirmation(true);
    setDeleteRegion(id);
  }
  const closeOpenConfirmation = () => {
    setOpenConfirmation(false);
    setDeleteRegion(0);
  }
  return (
    <div>
      <Confirm
        open={openConfirmation}
        onCancel={closeOpenConfirmation}
        onConfirm={deleteRegion}
      />
      <Button className="floatRight" as={Link} to="/app/region/add">Add Region</Button>
      <h1>Regions</h1>
      <div className="clear"></div>
      <div>{successMessage}</div>
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Property Name</Table.HeaderCell>
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
              <Table.Cell className="width40">{record.Property.name}</Table.Cell>
              <Table.Cell>
                <Button as={Link} to={`/app/region/edit/${record.id}`}>Edit</Button>
                <Button onClick={() => processDeleteRegion(record.id)}>Delete</Button>
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

const RegionAdd = () => {
  const { data } = useSWR(`property`, fetcher);
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState("");
  const history = useHistory();

  const onSubmit = (data) => {
    poster(`region/create`, data)
      .then((data) => {
        if (data.error_message) {
          setError(data.error_message);
        }
        else {
          history.push('/app/region');
        }
      });
  };

  return (
    <div>
      <Button className="floatRight" as={Link} to="/app/region">Back</Button>
      <h1>Add Region</h1>
      <form className="formStyle" onSubmit={handleSubmit(onSubmit)}>
      <div className="error">{error}</div>
        <input className="input" {...register("name", {required: true})} placeholder="Region Name" />
        <select className="input" {...register("property_id", {required: true})}>
        <option value="">Select Property</option>
        {data && data.rows.map((record, i) => (
          <option key={i} value={record.id}>{record.name}</option>
        ))}
      </select>
        <input className="button" type="submit" />
      </form>
    </div>
  );
}

const RegionEdit = () => {
  const { data } = useSWR(`property`, fetcher);
  const { register, handleSubmit, setValue } = useForm();
  const [name, setName] = useState("");
  const [propertyId, setPropertyId] = useState("");
  const [error, setError] = useState("");
  const { id } = useParams();
  const history = useHistory();

  const onSubmit = (data) => {
    data.id = id;
    setName(data.name);
    poster(`region/update`, data)
      .then((data) => {
        if (data.error_message) {
          setError(data.error_message);
        }
        else {
          history.push('/app/region');
        }
      });
  };

  useEffect(() => {
    fetcher(`region?id=${id}`)
    .then((data) => {
      setName(data.rows[0].name);
      setPropertyId(data.rows[0].Property.id)
    })
    .catch((error) => {
      console.log(error);
    });
  }, []);

  return (
    <div>
      <Button className="floatRight" as={Link} to="/app/region">Back</Button>
      <h1>Edit Region</h1>
      <form className="formStyle" onSubmit={handleSubmit(onSubmit)}>
        <div className="error">{error}</div>
        <input className="input" {...register("name", {required: true})} {...setValue('name', name)} placeholder="Region Name" />
        <select className="input" {...register("property_id", {required: true})} {...setValue('property_id', propertyId)}>
          <option value="">Select Property</option>
          {data && data.rows.map((record, i) => (
            <option key={i} value={record.id}>{record.name}</option>
          ))}
        </select>
        <input className="button" type="submit" />
      </form>
    </div>
  );
}

export { Region, RegionAdd, RegionEdit }
