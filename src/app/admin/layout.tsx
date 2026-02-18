'use client';
export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="admin-layout-wrapper">
            <style jsx global>{`
                nav, footer { display: none !important; }
                main { padding-top: 0 !important; padding-bottom: 0 !important; max-width: none !important; margin: 0 !important; }
            `}</style>
            {children}
        </div>
    );
}
