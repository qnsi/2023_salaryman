export const TagsSidebar = ({
  tags,
  filterByTag,
  setFilterByTag,
}: {
  tags: string[];
  filterByTag: string;
  setFilterByTag: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <>
      <div
        style={{ color: filterByTag === "" ? "#000" : "#999" }}
        onClick={() => setFilterByTag("")}
      >
        Don't filter by tag
      </div>
      {tags.map((tag) => (
        <div
          style={{ color: filterByTag === tag ? "#000" : "#999" }}
          onClick={() => setFilterByTag(tag)}
        >
          {tag}
        </div>
      ))}
    </>
  );
};
