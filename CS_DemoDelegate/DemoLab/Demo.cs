using System;
using DemoLab;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DemoLab
{
    public class Demo
    {
        public void DoSomething(CallBackDelegate callBack)
        {
            Console.WriteLine("hello from DoSomething()!");
            callBack?.Invoke("hello world!");
            Console.WriteLine("DoSomething() Ending!");

        }

    }
}
