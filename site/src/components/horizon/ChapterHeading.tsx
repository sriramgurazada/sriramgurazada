type Props = {
  /** Two digits. The chapter's place in the sequence. */
  index: string;
  eyebrow: string;
  heading: string;
  standfirst?: string;
  /** Renders the heading as an <h1>. Exactly one per page should. */
  top?: boolean;
  className?: string;
};

export default function ChapterHeading({
  index,
  eyebrow,
  heading,
  standfirst,
  top,
  className = "",
}: Props) {
  const Tag = top ? "h1" : "h2";

  return (
    <div className={className}>
      <p className="label flex items-center gap-3">
        <span className="text-ivory">{index}</span>
        {/* Decorative: the eyebrow beside it already reads as a label. */}
        <span aria-hidden="true" className="h-px w-8 bg-contour/40" />
        <span>{eyebrow}</span>
      </p>
      <Tag className="mt-4 max-w-[22ch] text-chapter font-semibold tracking-tight text-balance">
        {heading}
      </Tag>
      {standfirst && (
        <p className="reading mt-4 text-lede text-muted text-pretty">{standfirst}</p>
      )}
    </div>
  );
}
