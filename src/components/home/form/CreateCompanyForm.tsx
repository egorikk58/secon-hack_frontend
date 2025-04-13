import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { companyFormSchema, CompanyFormValues } from '@/schemas';

interface CreateCompanyFormProps {
  onSubmit: (values: CompanyFormValues) => void;
}

export function CreateCompanyForm({ onSubmit }: CreateCompanyFormProps) {
  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  return (
    <div className='bg-white rounded-lg p-6 w-full max-w-md mx-auto shadow-s border'>
      <h2 className='text-2xl font-bold mb-4 font-arkhip'>Создание компании</h2>
      <p className='mb-6 text-gray-600'>
        Прежде чем продолжить, вам необходимо создать компанию.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Название компании</FormLabel>
                <FormControl>
                  <Input placeholder='Введите название' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Описание (необязательно)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Краткое описание компании'
                    className='resize-none'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='flex justify-center'>
            <Button type='submit' variant={'project'}>
              Создать
            </Button>
          </div>
        </form>
      </Form>
    </div >
  );
}