import * as React from 'react';
import SortableJS from 'sortablejs';

interface SortableItem {
  id: string | number;
}

type SortableProps<T extends SortableItem> = {
  // list
  children: React.ReactElement[];
  list: T[];
  setList?(newList: T[]): void;
  // options
  component?: React.ElementType;
  handle?: string;
};

export const Sortable = <T extends SortableItem>({ list, setList = () => {}, handle, component, children }: SortableProps<T>) => {
  const elRef = React.useRef<HTMLElement | null>(null);
  const ListRoot: React.ElementType = component || 'ul';

  // Follow list and setList props in a ref to avoid unecessary effects.
  const listRef = React.useRef(list);
  const setListRef = React.useRef(setList);
  React.useEffect(() => {
    listRef.current = list;
  }, [list]);
  React.useEffect(() => {
    setListRef.current = setList;
  }, [setList]);

  // On component mount, init sortableJs.
  React.useEffect(() => {
    if (elRef.current) {
      const sort = SortableJS.create(elRef.current, {
        handle,
        draggable: '>*',
        chosenClass: 'sortable-chosen',
        ghostClass: 'sortable-ghost',
        onUpdate: (event) => {
          if (!event || event.oldIndex === undefined || event.newIndex === undefined) {
            return;
          }
          const newList = [...listRef.current];
          const newIndex = event.newIndex;
          const oldIndex = event.oldIndex;
          if (oldIndex >= newList.length || newIndex >= newList.length) {
            return;
          }
          newList.splice(newIndex, 0, newList.splice(oldIndex, 1)[0]);
          setListRef.current(newList);
        },
      });
      return () => {
        sort.destroy();
      };
    }
    return () => {};
  }, [handle]);

  return (
    <ListRoot ref={elRef} style={{ margin: 0, padding: 0 }}>
      {children}
    </ListRoot>
  );
};
