using System;
using System.IO;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CS_DemoFileIO
{
    class Program
    {
        static void WriteBinaryFile(string data)
        {
            FileStream stream = new FileStream("SampleBinary.bin", FileMode.Create, FileAccess.Write);
            BinaryWriter writer = new BinaryWriter(stream);
            try
            {
                writer.Write(true);
                writer.Write(DateTime.Now.ToString());
                writer.Write(1000);
                writer.Write(data);
                writer.Flush();
            }
            catch (IOException ex)
            {

                Console.WriteLine(ex.Message);
            }
            finally
            {
                writer.Close();
                writer.Dispose();
                stream.Close();
                stream.Dispose();

            }

        }

        //below program for Read binary file 
        static void ReadBinaryFile()
        {
            FileStream stream = new FileStream("SampleBinary.bin", FileMode.Open, FileAccess.Read);
            BinaryReader reader = new BinaryReader(stream);

            try
            {
                Console.WriteLine(reader.ReadBoolean());
                Console.WriteLine(DateTime.Parse(reader.ReadString()));
                Console.WriteLine(reader.ReadInt32());
                Console.WriteLine(reader.ReadString());

            }
            catch (IOException ex)
            {

                Console.WriteLine(ex.Message);
            }
            finally
            {
                reader.Close();
                reader.Dispose();
                stream.Close();
                stream.Dispose();

            }

        }
        

        // below program for writer text file \
        static void WriteTextFile(string data)
        {
            FileStream stream = new FileStream("SampleTextFile.txt", FileMode.Create, FileAccess.Write);
            StreamWriter writer = new StreamWriter(stream);

            try
            {
                writer.WriteLine(data);
            }
            catch (IOException ex)
            {

                Console.WriteLine(ex.Message);
            }
            finally
            {
                writer.Close();
                writer.Dispose();
                stream.Close();
                stream.Dispose();
            }
        }

        // below program for read text file

        static void ReadTextFile()
        {
            FileStream stream = new FileStream("SampleTextFile.txt", FileMode.Open, FileAccess.Read);
            StreamReader reader = new StreamReader(stream);

            try
            {
                string data = reader.ReadToEnd();
                Console.WriteLine(data);
            }
            catch (IOException ex)
            {

                Console.WriteLine(ex.Message);
            }

            finally
            {
                reader.Close();
                reader.Dispose();
                stream.Close();
                stream.Dispose();
            }
        }
           
        static void Main(string[] args)
        {
            //Console.WriteLine("Enter the input data");
            //string input = Console.ReadLine();
            //WriteBinaryFile(input);

            //ReadBinaryFile();   


            //Console.WriteLine("Enter the input data:");
            //string input = Console.ReadLine();
            //WriteTextFile(input);


            ReadTextFile();


            Console.ReadKey();


        }
    }
}
