import { cn } from '../../../utils/cn';

type TextAreaWithHighlightProps = {
  text: string;
  onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
  wordsToBeHighlighted: string[];
  className?: string;
};

export const TextAreaWithHighlight = ({
  text,
  onChange,
  wordsToBeHighlighted,
  className,
}: TextAreaWithHighlightProps) => {
  const highlightRecongizedWords = (text: string) => {
    if (!text) return [];
    const regexPattern = '(' + wordsToBeHighlighted.join('|') + ')';

    const textSplitByWordsToBeHighlighted = text.split(new RegExp(regexPattern, 'i'));
    const formatted = [];
    for (const word of textSplitByWordsToBeHighlighted) {
      if (wordsToBeHighlighted.includes(word)) {
        formatted.push(<span className='bg-main-light'>{word}</span>);
      } else {
        formatted.push(word);
      }
    }
    return formatted;
  };
  return (
    <div className={cn('relative h-[232px] rounded-lg  bg-white', className)}>
      <textarea
        className={cn(
          'absolute left-0 top-0 h-full w-full resize-none rounded-lg bg-transparent px-4 py-2 outline-none',
          className,
        )}
        value={text}
        onChange={onChange}
      />
      <div className={cn('w-full rounded-lg px-4 py-2', className)}>{highlightRecongizedWords(text)}</div>
    </div>
  );
};
