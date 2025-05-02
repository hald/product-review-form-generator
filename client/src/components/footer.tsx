export default function Footer() {
  return (
    <footer className="bg-gray-100 mt-auto">
      <div className="container mx-auto px-4 py-4 text-center text-gray-600 text-sm">
        <p>© {new Date().getFullYear()} Product Review Form Builder. Powered by OpenAI.</p>
      </div>
    </footer>
  );
}
