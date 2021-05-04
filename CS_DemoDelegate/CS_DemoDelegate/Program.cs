using System;
using DemoLab;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CS_DemoDelegate
{
    class Myclass
    {
       


        public void Process(string data)
        {
            Console.WriteLine($"{data}! from prcess()!");
        }
    }
    class Program
    {
        static void Main(string[] args)
        {
            Demo d = new Demo();
            Myclass c = new Myclass();
            CallBackDelegate cb = new CallBackDelegate(c.Process);
            d.DoSomething(cb);

            Console.ReadKey();
        }
    }
}
