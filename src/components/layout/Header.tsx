interface HeaderProps {
  title: string;
  description?: string;
}

export default function Header({
  title,
  description,
}: HeaderProps) {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold">
        {title}
      </h1>

      {description && (
        <p className="mt-2 text-gray-500">
          {description}
        </p>
      )}
    </div>
  );
}