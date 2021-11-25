import React from 'react';
import { Link, Switch, Route } from "react-router-dom";
import {
  Container,
  Image,
  Menu,
} from 'semantic-ui-react';
import { Organisation, OrganisationAdd, OrganisationEdit } from './organisation';
import { Property, PropertyAdd, PropertyEdit } from './property';
import { Region, RegionAdd, RegionEdit } from './region';
import { Field, FieldAdd, FieldEdit } from './field';
import { Crop, CropAdd, CropEdit } from './crop';
import { CropCycle, CropCycleAdd, CropCycleEdit } from './cropcycle';
import { CropCycleField, CropCycleFieldAdd, CropCycleFieldEdit } from './cropcyclefield';
import ErrorPage from './error-page';

const Private = () => (
  <div>
    <Menu fixed='top' inverted>
      <Container>
        <Menu.Item as='a' header>
          <Image size='mini' src='https://image.shutterstock.com/image-vector/agriculture-logo-farming-farm-600w-1750933820.jpg' style={{ marginRight: '1.5em' }} />
          Agro Services
        </Menu.Item>
        <Menu.Item as={Link} to="/app/organizations">Organizations</Menu.Item>
        <Menu.Item as={Link} to="/app/property">Property</Menu.Item>
        <Menu.Item as={Link} to="/app/region">Region</Menu.Item>
        <Menu.Item as={Link} to="/app/field">Field</Menu.Item>
        <Menu.Item as={Link} to="/app/crop">Crop</Menu.Item>
        <Menu.Item as={Link} to="/app/cropcycle">Crop Cycle</Menu.Item>
        <Menu.Item as={Link} to="/app/cropcyclefield">Crop Cycle Field</Menu.Item>
      </Container>
    </Menu>
    <Container style={{ marginTop: '7em' }}>
      <Switch>
        <Route path="/app/cropcyclefield/edit/:id" component={CropCycleFieldEdit} />
        <Route path="/app/cropcyclefield/add" component={CropCycleFieldAdd} />
        <Route path="/app/cropcyclefield" component={CropCycleField} />
        <Route path="/app/cropcycle/edit/:id" component={CropCycleEdit} />
        <Route path="/app/cropcycle/add" component={CropCycleAdd} />
        <Route path="/app/cropcycle" component={CropCycle} />
        <Route path="/app/crop/edit/:id" component={CropEdit} />
        <Route path="/app/crop/add" component={CropAdd} />
        <Route path="/app/crop" component={Crop} />
        <Route path="/app/field/edit/:id" component={FieldEdit} />
        <Route path="/app/field/add" component={FieldAdd} />
        <Route path="/app/field" component={Field} />
        <Route path="/app/region/edit/:id" component={RegionEdit} />
        <Route path="/app/region/add" component={RegionAdd} />
        <Route path="/app/region" component={Region} />
        <Route path="/app/property/edit/:id" component={PropertyEdit} />
        <Route path="/app/property/add" component={PropertyAdd} />
        <Route path="/app/property" component={Property} />
        <Route path="/app/organizations/edit/:id" component={OrganisationEdit} />
        <Route path="/app/organizations/add" component={OrganisationAdd} />
        <Route path="/app/organizations" component={Organisation} />
        <Route path="/app/*" component={ErrorPage} />
      </Switch>
    </Container>
  </div>
)

export default Private;