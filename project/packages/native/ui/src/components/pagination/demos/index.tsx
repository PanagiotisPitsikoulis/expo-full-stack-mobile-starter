import { useState } from "react";
import { View } from "react-native";

import { Pagination } from "../..";

function PageButtons({ size }: { size?: "sm" | "md" | "lg" }) {
  const [page, setPage] = useState(1);
  const totalPages = 3;

  return (
    <Pagination size={size}>
      <Pagination.Summary>
        Page {page} of {totalPages}
      </Pagination.Summary>
      <Pagination.Content>
        <Pagination.Item>
          <Pagination.Previous
            isDisabled={page === 1}
            onPress={() => setPage((value) => value - 1)}
          >
            <Pagination.PreviousIcon />
            Previous
          </Pagination.Previous>
        </Pagination.Item>
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((item) => (
          <Pagination.Item key={item}>
            <Pagination.Link isActive={item === page} onPress={() => setPage(item)}>
              {item}
            </Pagination.Link>
          </Pagination.Item>
        ))}
        <Pagination.Item>
          <Pagination.Next
            isDisabled={page === totalPages}
            onPress={() => setPage((value) => value + 1)}
          >
            Next
            <Pagination.NextIcon />
          </Pagination.Next>
        </Pagination.Item>
      </Pagination.Content>
    </Pagination>
  );
}

export function Basic() {
  return <PageButtons />;
}

export function WithSummary() {
  return <PageButtons />;
}

export function WithEllipsis() {
  const [page, setPage] = useState(4);

  return (
    <Pagination>
      <Pagination.Content>
        {[1, "ellipsis-start", 3, 4, 5, "ellipsis-end", 12].map((item) => (
          <Pagination.Item key={item}>
            {typeof item === "number" ? (
              <Pagination.Link isActive={item === page} onPress={() => setPage(item)}>
                {item}
              </Pagination.Link>
            ) : (
              <Pagination.Ellipsis />
            )}
          </Pagination.Item>
        ))}
      </Pagination.Content>
    </Pagination>
  );
}

export function Sizes() {
  return (
    <View className="gap-4">
      <PageButtons size="sm" />
      <PageButtons size="md" />
      <PageButtons size="lg" />
    </View>
  );
}

export { Basic as Controlled, Basic as Disabled, Basic as SimplePrevNext };
