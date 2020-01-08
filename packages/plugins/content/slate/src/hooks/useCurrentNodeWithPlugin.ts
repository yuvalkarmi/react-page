import { Editor, Element } from 'slate';
import { useSlate } from 'slate-react';
import { SlatePluginDefinition } from 'src/types/slatePluginDefinitions';

export const getCurrentNodeWithPlugin = <T>(
  editor,
  plugin: SlatePluginDefinition<T>
): Element => {
  if (plugin.pluginType === 'custom') {
    return null;
  }

  const match =
    plugin.pluginType === 'component'
      ? elem => elem.type === plugin.type
      : plugin.pluginType === 'data'
      ? // search for data
        ({ type, children, ...data }) => {
          // tslint:disable-next-line:no-any
          const matches = plugin.dataMatches(data as any);

          return matches;
        }
      : null;

  const [matchingNode] = Editor.nodes(editor, {
    match: match,
    mode: 'all', // FIXME: whats the best value?
  });
  return (matchingNode as unknown) as Element;
};
export default <T>(plugin: SlatePluginDefinition<T>) => {
  const editor = useSlate();
  return getCurrentNodeWithPlugin(editor, plugin);
};
