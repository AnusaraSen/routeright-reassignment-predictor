import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Card, CardContent } from '@/components/common/Card';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center py-12 px-4">
      <Card className="max-w-md w-full text-center p-8">
        <CardContent className="space-y-6 p-0">
          <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500">
            <FileQuestion className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
              404 Error
            </span>
            <h1 className="text-2xl font-bold text-slate-900">Page Not Found</h1>
            <p className="text-sm text-slate-500 leading-relaxed">
              The requested path does not match any RouteRight AI interface page. Please verify the
              URL or use the links below to return to the active application.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link to="/" className="w-full sm:w-auto">
              <Button variant="primary" fullWidth leftIcon={<Home className="w-4 h-4" />}>
                Return Home
              </Button>
            </Link>
            <Link to="/predict" className="w-full sm:w-auto">
              <Button variant="outline" fullWidth leftIcon={<ArrowLeft className="w-4 h-4" />}>
                Go to Predict
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFoundPage;
