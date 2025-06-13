export function When({ truthy, children }: {
    truthy: boolean;
    children: React.ReactNode;
}) {
    return truthy ? <>{children}</> : null;
}