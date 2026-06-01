import { Tag, TagGroup } from "../..";

export function Default() {
  return (
    <TagGroup aria-label="Tags">
      <TagGroup.List>
        <Tag id="react">React</Tag>
        <Tag id="removable">
          Removable
          <Tag.RemoveButton />
        </Tag>
        <Tag id="primary" color="primary">
          Primary
        </Tag>
        <Tag id="success" color="success">
          Success
        </Tag>
      </TagGroup.List>
    </TagGroup>
  );
}

export { Default as Basic };
