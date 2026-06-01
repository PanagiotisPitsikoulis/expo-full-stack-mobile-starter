import { Breadcrumbs, Text } from "../..";

export function BreadcrumbsBasic() {
  return (
    <Breadcrumbs>
      <Breadcrumbs.Item href="#">Products</Breadcrumbs.Item>
      <Breadcrumbs.Item isCurrent>Laptop</Breadcrumbs.Item>
    </Breadcrumbs>
  );
}

export function CustomRenderFunction() {
  return (
    <Breadcrumbs>
      <Breadcrumbs.Item href="#">Home</Breadcrumbs.Item>
      <Breadcrumbs.Item href="#">Products</Breadcrumbs.Item>
      <Breadcrumbs.Item href="#">Electronics</Breadcrumbs.Item>
      <Breadcrumbs.Item isCurrent>Laptop</Breadcrumbs.Item>
    </Breadcrumbs>
  );
}

export function BreadcrumbsCustomSeparator() {
  return (
    <Breadcrumbs separator={<Text className="text-muted">/</Text>}>
      <Breadcrumbs.Item href="#">Home</Breadcrumbs.Item>
      <Breadcrumbs.Item href="#">Products</Breadcrumbs.Item>
      <Breadcrumbs.Item href="#">Electronics</Breadcrumbs.Item>
      <Breadcrumbs.Item isCurrent>Laptop</Breadcrumbs.Item>
    </Breadcrumbs>
  );
}

export function BreadcrumbsDisabled() {
  return (
    <Breadcrumbs>
      <Breadcrumbs.Item>Home</Breadcrumbs.Item>
      <Breadcrumbs.Item>Products</Breadcrumbs.Item>
      <Breadcrumbs.Item>Electronics</Breadcrumbs.Item>
      <Breadcrumbs.Item isCurrent>Laptop</Breadcrumbs.Item>
    </Breadcrumbs>
  );
}

export function BreadcrumbsLevel2() {
  return (
    <Breadcrumbs>
      <Breadcrumbs.Item href="#">Home</Breadcrumbs.Item>
      <Breadcrumbs.Item isCurrent>Current Page</Breadcrumbs.Item>
    </Breadcrumbs>
  );
}

export function BreadcrumbsLevel3() {
  return (
    <Breadcrumbs>
      <Breadcrumbs.Item href="#">Home</Breadcrumbs.Item>
      <Breadcrumbs.Item href="#">Category</Breadcrumbs.Item>
      <Breadcrumbs.Item isCurrent>Current Page</Breadcrumbs.Item>
    </Breadcrumbs>
  );
}
